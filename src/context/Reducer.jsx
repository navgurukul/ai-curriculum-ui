const reducer = (state, action) => {
  switch (action.type) {
    case "QUICK_SUGGESTION_DATA":
      return { ...state, quickSuggestionData: action.payload };
    case "CLEAR_SUGGESTION_DATA":
      return { ...state, quickSuggestionData: "" };
      // case "TOGGLE_SIDEBAR": 
      // return { ...state, isSidebarVisible: !state.isSidebarVisible };
    default:
      throw new Error("No Matched Action!");
  }
};

export default reducer;























