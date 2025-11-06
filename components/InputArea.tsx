
import React from 'react';
import { InputTab } from '../types';
import { SendIcon, UploadIcon } from './Icons';

interface InputAreaProps {
  activeInputTab: InputTab;
  setActiveInputTab: (tab: InputTab) => void;
  problemInput: string;
  setProblemInput: (input: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  handleSolve: () => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  activeInputTab,
  setActiveInputTab,
  problemInput,
  setProblemInput,
  imageFile,
  setImageFile,
  handleSolve,
  isLoading,
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveInputTab(InputTab.Text)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeInputTab === InputTab.Text
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            লেখা
          </button>
          <button
            onClick={() => setActiveInputTab(InputTab.Image)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeInputTab === InputTab.Image
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            ছবি
          </button>
        </nav>
      </div>

      {activeInputTab === InputTab.Text ? (
        <textarea
          value={problemInput}
          onChange={(e) => setProblemInput(e.target.value)}
          placeholder="উদাহরণ: 2x + 5 = 15 সমীকরণে x এর মান নির্ণয় করুন"
          className="w-full h-28 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />
      ) : (
        <div className="w-full h-28 border-2 border-dashed border-slate-300 rounded-lg flex flex-col justify-center items-center text-slate-500">
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer p-4 rounded-lg text-center ${isLoading ? 'opacity-50' : 'hover:bg-slate-100'}`}
          >
            {imageFile ? (
              <p className="text-sm font-medium text-green-600">{imageFile.name}</p>
            ) : (
              <>
                <UploadIcon className="mx-auto h-8 w-8 text-slate-400" />
                <span className="mt-2 block text-sm font-medium">ছবি আপলোড করুন</span>
              </>
            )}
          </label>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSolve}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              প্রসেসিং...
            </>
          ) : (
            <>
              সমাধান করুন
              <SendIcon className="ml-2 -mr-1 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;
