export class KeyboardShortcutDescription {

  NAME: KeyboardShortcutName;
  keyboardShortcuts: string[] = [];
  //@ts-ignore
  executeFunction: (yasqe: Yasqe) => void
}

export enum KeyboardShortcutName {
  TRIGGER_AUTOCOMPLETION = 'trigger_autocompletion',
  DELETE_CURRENT_LINE = 'delete_current_line',
  COMMENT_SELECTED_LINE = 'comment_selected_line',
  COPY_LINE_DOWN = 'copy_line_down',
  COPY_LINE_UP = 'copy_line_up',
  AUTO_FORMAT_SELECTED_LINE = 'auto_format_selected_line',
  INDENT_CURRENT_LINE_MORE = 'indent_current_line_more',
  INDENT_CURRENT_LINE_LESS = 'indent_current_line_less',
  EXECUTE_QUERY_OR_UPDATE = 'execute_query_or_update',
  EXECUTE_EXPLAIN_PLAN_FOR_QUERY = 'execute_explain_plan_for_query',
  CREATE_TAB = 'create_tab',
  CREATE_SAVE_QUERY = 'create_save_query',
  SWITCH_NEXT_TAB = 'switch_next_tab',
  SWITCH_PREVIOUS_TAB = 'switch_previous_tab',
  CLOSES_ALL_TABS = 'closes_all_tabs',
  F11 = 'f11',
  ESC = 'esc'
}