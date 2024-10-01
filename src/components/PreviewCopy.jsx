import { useState } from "react";
import { useCopyToClipboard } from "react-use";
import { CheckIcon, ClipboardIcon } from "lucide-react";

export default function PreviewCopy({ codeType, componentCode = "" }) {
  const [buttonText, setButtonText] = useState("Copy");
  const [copyStatus, copyToClipboard] = useCopyToClipboard();
  

  const codeTypeMap = {
    html: "HTML",
    jsx: "JSX",
    vue: "Vue",
  };

  const codeTypeLabel = codeTypeMap[codeType];

  function handleCopyToClipboard() {
    copyToClipboard(componentCode);

    if (copyStatus.error) {
      setButtonText("Error");
      return;
    }

    setButtonText("Copied");

    setTimeout(() => {
      setButtonText("Copy");
    }, 3000);
  }

  const hasCopied = buttonText === "Copied"; 

  return (
    <button
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onClick={handleCopyToClipboard}
    >
      <span className="sr-only">Copy {codeTypeLabel}</span>
      {hasCopied ? <CheckIcon className="mr-2 h-4 w-4" /> : <ClipboardIcon className="mr-2 h-4 w-4" />}
      {buttonText}
    </button>
  );
}
