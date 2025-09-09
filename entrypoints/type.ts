export enum MessageType {
  clickExtIcon = "clickExtIcon",
  changeTheme = "changeTheme",
  changeLocale = "changeLocale",
  changeDefaultEnabled = "DefaultEnabled",
}

export enum AnnotateType {
  getAnnotations = "getAnnotations",
  addAnnotate = "addAnnotate",
  updateAnnotate = "updateAnnotate",
  deleteAnnotate = "deleteAnnotate",
}

export enum BasicType {
  annotate = "annotate",
}

export enum MessageFrom {
  contentScript = "contentScript",
  background = "background",
  popUp = "popUp",
  sidePanel = "sidePanel",
}

class ExtMessage {
  content?: string;
  clickExtIcon?: string;
  from?: MessageFrom;
  eventType?: string;
  constructor(messageType: MessageType) {
    this.messageType = messageType;
  }
  basicType?: string;
  params: Record<string, any> = {};
  messageType: MessageType | AnnotateType;
}

export default ExtMessage;

export enum SidebarType {
  HOME = "home",
  SETTINGS = "settings",
  ACCOUNT = "account",
}
