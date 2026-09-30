import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export default function PreviewView({ handleSetShowPreview }) {
  return (
    <Tabs
      defaultValue="preview"
      className="mr-auto"
      // onValueChange also fires for keyboard navigation, which per-trigger onClick missed
      onValueChange={(value) => handleSetShowPreview(value === 'preview')}
    >
      <TabsList className="h-8 gap-1 rounded-lg bg-slate-100 p-0.5">
        <TabsTrigger
          value="preview"
          className="h-7 rounded-md px-3 text-xs font-medium text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
        >
          Preview
        </TabsTrigger>
        <TabsTrigger
          value="code"
          className="h-7 rounded-md px-3 text-xs font-medium text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
        >
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}