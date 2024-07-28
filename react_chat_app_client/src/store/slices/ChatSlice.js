export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  messagedContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  setChannels: (channels) => set({ channels }),
  addChannel: (newChannel) => {
    const channels = get().channels;
    set({ channels: [newChannel, ...channels] });
  },
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  setSelectedChatType: (selectedChatType) => {
    set({ selectedChatType });
  },
  setSelectedChatData: (selectedChatData) => {
    set({ selectedChatData });
  },
  setSelectedChatMessages: (selectedChatMessages) => {
    set({ selectedChatMessages });
  },
  setMessagedContacts: (messagedContacts) => {
    set({ messagedContacts });
  },
  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    });
  },
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    set({
      selectedChatMessages: [...selectedChatMessages, message],
    });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1) {
      const [channel] = channels.splice(index, 1);
      channels.unshift(channel);
    } else {
      channels.unshift({ _id: message.channelId });
    }
    set({ channels });
  },
});
