import React, { useRef, useState } from 'react'
import { Image, Send, X } from "lucide-react";
import { useChatStore } from '../store/useChatStore.js';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className='p-3'>
      <form>
        {imagePreview && (
          <div className="mb-3 flex items-center gap-2 z-20">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
        <div className='flex items-center justify-center gap-3'>
          <input type="text" placeholder="Type here"
           className="input input-bordered w-full"
           value={text}
           onChange={(e) => setText(e.target.value)} />

          <input type="file" accept='image/' hidden ref={fileInputRef}
            onChange={handleImageChange} />

          <button type="button" className={`hidden sm:flex btn btn-circle  ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => fileInputRef.current?.click()} >
            <Image size={20} />
          </button>

          <button type="submit" onClick={handleSendMessage} className="btn btn-md btn-circle">
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageInput