let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  keyboardShortcutConfiguration: {
    execute_explain_plan_for_query: true,
    execute_chat_gpt_explain_plan_for_query: true,
  },
  endpoint: () => {
    return "/repositories/test-repo";
  },
  prefixes: getPrefixes(),
  yasqeAutocomplete: getYasqeAutocompleter(),
  componentId: 'keyboard-shortcut'
};

ontoElement.addEventListener('output', (evt) => {
  if ('notificationMessage' === evt.detail.TYPE) {
    document.getElementById('actionOutputField').value = JSON.stringify(evt.detail.payload);
  }
});

function removeExecutableShortcuts() {
  ontoElement.config = {
    ...ontoElement.config,
    keyboardShortcutConfiguration: {
      execute_query_or_update: false,
      execute_explain_plan_for_query: false,
      execute_chat_gpt_explain_plan_for_query: false,
      create_tab: false,
      create_save_query: false,
      switch_next_tab: false,
      switch_previous_tab: false,
      closes_other_tabs: false,
      closes_other_tabs_by_left_mouse_click: false,
    }
  };
}

function setVirtualRepository() {
  ontoElement.config = {... ontoElement.config, isVirtualRepository: true}
}
