import { DeepPartial } from "utility-types";
import { Mark, PopoverType } from "./type";
import { MarkState } from "./type";
import { createStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { deepMerge } from "@/lib/Utils";
import { isNil, keyBy } from "lodash";

export const createMarkStore = (options: DeepPartial<Mark>) => {
  return createStore<MarkState>()(
    subscribeWithSelector(
      immer((set) => ({
        ...deepMerge<Mark, DeepPartial<Mark>>(
          {
            popoverPos: {
              x: 0,
              y: 0,
            },
            popoverVisible: false,
            color: "",
            annotations: {},
            currentAnnotation: "",
          },
          options,
          "merge"
        ),
        changePopoverPos(value: PopoverType) {
          set((state) => {
            state.popoverPos = {
              ...value,
            };
          });
        },
        changePopoverVisible(value: boolean) {
          set((state) => {
            state.popoverVisible = value;
          });
        },
        changeColor(value: string) {
          set((state) => {
            state.color = value;
          });
        },
        changeAnnotations(
          id: string,
          value?: Record<string, any> | null | undefined
        ) {
          set((state) => {
            if (isNil(value)) {
              console.log("state.annotations[id]", state.annotations[id]);

              delete state.annotations[id];
            } else {
              state.annotations[id] = value;
            }
          });
        },
        initAllAnnotations(annotations: Record<string, any>) {
          set((state) => {
            state.annotations = keyBy(annotations, "uid");
          });
        },
        changeCurrentAnnotation(id) {
          set((state) => {
            state.currentAnnotation = id;
          });
        },
      }))
    )
  );
};

export type MarkStoreType = ReturnType<typeof createMarkStore>;
