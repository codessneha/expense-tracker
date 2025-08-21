import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from 'react-icons/lu';

const EmojiPickerPopup = ({ onEmojiClick, defaultEmoji = '📊' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(defaultEmoji);

    const handleEmojiClick = (emojiData) => {
        setSelectedEmoji(emojiData.emoji);
        if (onEmojiClick) {
            onEmojiClick(emojiData.emoji);
        }
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row items-start gap-2 mb-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
                    {selectedEmoji}
                </div>
                <LuImage className="text-gray-500" />
            </div>
            <p className="text-sm text-gray-500">Change icon</p>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-[90%] max-h-[80vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Select an Emoji</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                                aria-label="Close emoji picker"
                            >
                                <LuX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-[300px] h-[400px]">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                width="100%"
                                height="100%"
                                searchDisabled={false}
                                previewConfig={{
                                    showPreview: false
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopup;
