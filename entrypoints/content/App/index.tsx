import React, { useCallback, useEffect, useMemo, useState } from "react";
import { browser } from "wxt/browser";
import Header from "@/entrypoints/content/Header/index.tsx";
import AnnotationManager from "../AnnotationManager";
import AnnotateDom from "../AnnotateDom";
import { useTranslation } from "react-i18next";
import { useAppInconContext } from "@/state/hooks";
import { useSelection } from "../Hooks/useSelection";
import { useMarker } from "../Hooks/useMarker";
import { useMarkContext } from "../state/hooks";
import { useTextHighlighter } from "../Hooks/usePaint";
import { useScrollToAnnotation } from "../Hooks/useScrollToAnnotation";
import Marker from "@/lib/Marks/Marker";
import { EditAnnotation } from "../AnnotateDom/EditAnnotation";
import { AnnotateFormValue } from "../AnnotateDom/AnnotateForm";
import { AnnotationIcon } from "../AnnotateDom/AnnotationIcon";
import { CollapsePanel } from "@/components/collapsePanel";
import { AppInfoState } from "@/state/type";
import ExtMessage, { MessageType } from "@/entrypoints/type";
import { Theme } from "@/hooks/useStorage.type";
import { MarkState } from "../state/type";
import {
  Context,
  annotationWrapper,
  AttributeNameHighlightColor,
  AttributeNameHighlightId,
  cancelTruncation,
  HighlightClassName,
} from "@/lib/Marks/Marker.type";
import { Annotate } from "@/services/api.type";
import { getNormalizedUrl, createWavyLines } from "@/lib/Utils";
import { createRoot } from "react-dom/client";
import { isEmpty, isNil } from "lodash";
import { addAnnotate, getAnnotations } from "@/services/api";
import { AnnotateContext } from "./AppContext";
import { EditAnnotateProvider } from "../AnnotateDom/EditAnnotationContext";
import "./index.module.css";
import "@/assets/main.css";

import moment from "moment";

export default () => {
  const [openEditAnnotate, setOpenEditAnnotate] = useState<boolean>(false);
  const [annotateUid, setAnnotateUid] = useState<string>("");
  const { i18n } = useTranslation();
  const appState = useAppInconContext((state: AppInfoState) => ({
    defaultEnabled: state.defaultEnabled,
    changeDefaultEndbaled: state.changeDefaultEndbaled,
    theme: state.theme,
    changeTheme: state.changeTheme,
    isLoaded: state.isLoaded,
    lang: state.i18n,
  }));
  const markState = useMarkContext((state: MarkState) => ({
    color: state.color,
    changeCurrentAnnotation: state.changeCurrentAnnotation,
    annotations: state.annotations,
    changeAnnotations: state.changeAnnotations,
    initAllAnnotations: state.initAllAnnotations,
  }));

  const [_, startObserver] = useSelection();
  const { highlight } = useTextHighlighter();
  const [markerInstance, startMarker] = useMarker();
  const { scrollToAnnotation } = useScrollToAnnotation();

  const initI18n = useCallback(async () => {
    await i18n.changeLanguage(appState.lang);
  }, [i18n, appState.lang]);

  const messageListener = useMemo(
    () => () => {
      browser.runtime.onMessage.addListener(
        (message: ExtMessage, sender, sendResponse) => {
          console.log("message", message);
          if (message.messageType == MessageType.clickExtIcon) {
            appState.changeDefaultEndbaled(
              message?.content as unknown as boolean,
              true
            );
          } else if (message.messageType == MessageType.changeLocale) {
            i18n.changeLanguage(message.content);
          } else if (message.messageType == MessageType.changeTheme) {
            appState.changeTheme(message?.content as unknown as Theme, true);
          } else if (message.messageType === MessageType.changeDefaultEnabled) {
            appState.changeDefaultEndbaled(
              message?.content as unknown as boolean,
              true
            );
          }
        }
      );
    },
    [appState, i18n]
  );

  const handleFormSubmit = useCallback(
    (values: AnnotateFormValue) => {
      if (annotateUid && markerInstance) {
        // Clone the annotation to avoid mutating a frozen object
        let annotation = { ...(markState.annotations[annotateUid] || {}) };
        const notes = Array.isArray(annotation.data?.notes)
          ? [...annotation.data.notes]
          : [];
        const date = moment().valueOf();
        notes.push({
          userId: "231311",
          userName: "userName",
          text: values.annotate,
          date,
          isMe: true,
        });
        annotation = {
          ...annotation,
          data: {
            ...annotation.data,
            notes,
          },
          updateDate: moment().valueOf(),
        };
        markState.changeAnnotations(annotateUid, annotation);
        markerInstance?.unpaint(annotateUid);
        markerInstance?.paint(annotation);
      }
    },
    [markState.annotations, annotateUid, markerInstance]
  );

  const handleDeleteAnnotation = useCallback(() => {
    if (markerInstance) {
      markerInstance?.unpaint(annotateUid);
      setOpenEditAnnotate(false);
      markState.changeAnnotations(annotateUid);
    }
  }, [markerInstance, annotateUid, markState]);

  const openEditor = (uid: string) => {
    setAnnotateUid(uid);
    setOpenEditAnnotate(true);
    markState.changeCurrentAnnotation(uid);
  };

  /**
   * 高亮样式，波浪线加背景色
   * @param element
   * @param bgc
   */
  function applyHighlightStyle(element: HTMLElement, bgc: string) {
    element.parentElement?.classList.add(`${cancelTruncation}`);
    element.classList.add(`${HighlightClassName}`);
    const wavyBg = createWavyLines(bgc);
    element.style.setProperty("--underline-bg", wavyBg);
    element.style.setProperty("--bg", bgc);
    Object.assign(element.style, {
      backgroundColor: `${bgc}55`,
    });
  }

  /**
   * 生成注释图标
   * @param element
   * @param context
   * @returns
   */
  function renderAnnotationIconIfNeeded(
    element: HTMLElement,
    context: Context
  ) {
    const uid = context.serializedRange.uid;
    const hasAnnotation = context.serializedRange.data.notes;
    context.serializedRange;
    if (
      isEmpty(hasAnnotation) ||
      document.getElementById(`${annotationWrapper}-${uid}`)
    ) {
      return;
    }
    const iconContainer = document.createElement("div");
    iconContainer.classList.add(`${annotationWrapper}`);
    iconContainer.id = `${annotationWrapper}-${uid}`;
    iconContainer.setAttribute(AttributeNameHighlightId, uid);
    element.appendChild(iconContainer);

    const root = createRoot(iconContainer);
    root.render(
      <div className="annotationContent">
        <AnnotationIcon
          color={context.serializedRange.color}
          onClick={() => {
            openEditor(uid);
          }}
          value={{
            ...context.serializedRange,
          }}
        />
      </div>
    );
  }

  /**
   * 重绘注释
   * @param annotateData
   * @param marker
   * @returns
   */
  function repaintAnnotation(annotateData: Annotate[], marker: Marker) {
    if (!marker || annotateData.length === 0) return;
    let failureCount = 0;
    annotateData.forEach((annotation) => {
      const { errors } = marker.paint(annotation);
      Object.keys(errors).forEach((i) => {
        console.warn(errors[i]);
      });
      failureCount += Object.keys(errors).length;
    });
    console.log(
      `[annotate]: loaded ${annotateData.length} marks, ${failureCount} failed`
    );
  }

  /**
   * 初始化
   */
  useEffect(() => {
    if (appState.isLoaded) {
      messageListener();
      initI18n();
      startObserver();
      const marker = startMarker(
        {
          onHighlightClick: (
            context: Context,
            _element: HTMLElement,
            _e: Event
          ) => {
            const uid = context.serializedRange.uid;
            openEditor(uid);
          },
        },
        {
          paintHighlight: (context: Context, element: HTMLElement) => {
            const bgc =
              element.getAttribute(AttributeNameHighlightColor) || "#ffff00";
            applyHighlightStyle(element, bgc);
            renderAnnotationIconIfNeeded(element, context);
          },
        }
      );
      (async () => {
        marker.addEventListeners();
        const url = getNormalizedUrl();
        const annotateData = await getAnnotations(url);
        const list = annotateData.data || [];
        if (!isEmpty(list)) {
          repaintAnnotation(list, marker);
          markState.initAllAnnotations(list);
          scrollToAnnotation();
        }
      })();
    }
  }, [appState.isLoaded]);

  // 颜色变化，保存当前的笔记值
  useEffect(() => {
    if (!isEmpty(markState.color) && !isNil(markerInstance)) {
      const date = moment().valueOf();
      const annotation = highlight(markState.color, markerInstance, date);
      if (!isNil(annotation)) {
        addAnnotate({
          ...annotation,
          pageData: {
            url: getNormalizedUrl(),
            title: document.title,
            host: window.location.host,
          },
          data: {
            notes: [],
          },
          createDate: date,
          updateDate: date,
        });
      }
    }
  }, [markerInstance, markState.color]);

  const shouldRenderHeader = useMemo(() => {
    return appState.defaultEnabled && appState.isLoaded;
  }, [appState.defaultEnabled, appState.isLoaded]);

  useEffect(() => {
    const shadowRoot = document.querySelector("dolphin-memory")?.shadowRoot;
    const body = shadowRoot?.querySelector("body");
    if (body) {
      body.className = themeClass;
    }
  }, [appState.theme]);

  const themeClass = appState.theme === "dark" ? "dark" : "";

  return (
    <AnnotateContext.Provider
      value={{
        openEditor,
      }}
    >
      {shouldRenderHeader && (
        <CollapsePanel>
          <div className={`${themeClass} h-[600px] w-[350px]`}>
            <div className="absolute w-full h-full bg-background z-[100] rounded-l-lg flex flex-col">
              <Header headTitle={"annotationManager"} />
              <AnnotationManager className="flex-1" />
            </div>
          </div>
        </CollapsePanel>
      )}
      <AnnotateDom />
      <EditAnnotateProvider>
        <EditAnnotation
          open={openEditAnnotate}
          annotateUid={annotateUid}
          setOpen={setOpenEditAnnotate}
          handleDelete={handleDeleteAnnotation}
          onFormSubmit={handleFormSubmit}
        />
      </EditAnnotateProvider>
    </AnnotateContext.Provider>
  );
};
