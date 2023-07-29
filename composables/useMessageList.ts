export const useMessageList = () => {
  const message_list = useState<{ message: string; id: number }[]>(() => []);
  const pushMessage = (message: string) => {
    const randomId = Math.floor(Math.random() * 1000000);
    message_list.value.push({ message, id: randomId });
    setTimeout(() => {
      message_list.value.shift();
    }, 5000);
  };
  return { message_list, pushMessage };
};
