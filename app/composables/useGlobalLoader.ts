export const useGlobalLoader = () => {
  const isLoading = useState("globalLoader.isLoading", () => true); // Start with true for initial load
  const message = useState("globalLoader.message", () => "");

  const showLoader = (loadingMessage = "Loading...") => {
    message.value = loadingMessage;
    isLoading.value = true;
  };

  const hideLoader = () => {
    isLoading.value = false;
    message.value = "";
  };

  const setMessage = (newMessage: string) => {
    message.value = newMessage;
  };

  return {
    isLoading: readonly(isLoading),
    message: readonly(message),
    showLoader,
    hideLoader,
    setMessage,
  };
};
