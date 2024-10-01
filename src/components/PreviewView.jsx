import ButtonStyle from '@component/ButtonStyle'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

export default function PreviewView({  handleSetShowPreview }) {
  return (
    
      <Tabs defaultValue="preview" className="relative mr-auto ">
          <TabsList className="w-full justify-center my-2 rounded-lg gap-2 mx-2 border-b bg-gray-100  p-0">
        <TabsTrigger value="preview" onClick={() => handleSetShowPreview(true)} className="">
          <p className="text-xs">Preview</p>
        </TabsTrigger>
        <TabsTrigger value="code" onClick={() => handleSetShowPreview(false)}>
         <p className="text-xs">Code </p> 
        </TabsTrigger>
      </TabsList>

     
    </Tabs>
  )
}
