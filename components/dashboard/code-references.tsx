'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism'

type Props = {
    fileReferences: { fileName: string; sourceCode: string; summary: string }[]
}



const FileReferences = ({ fileReferences }: Props) => {
    const [tab, setTab] = useState(fileReferences[0]?.fileName)
    return (
        <div className='max-w-[70vw]'>
            <Tabs value={tab} onValueChange={setTab}>
                <div className="overflow-x-scroll flex gap-2 bg-gray-200 p-1 rounded-md">
                    {fileReferences.map(file => (
                        <button onClick={() => setTab(file.fileName)} key={file.fileName} className={cn('px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',
                            { 'bg-primary text-primary-foreground ': tab === file.fileName, })}
                        >
                            {file.fileName}
                        </button>
                    ))}
                </div>
                {fileReferences.map(file => (<TabsContent key={file.fileName} value={file.fileName} className='max-h-[70vh] overflow-y-scroll max-w-7xl rounded-md'>
                    <SyntaxHighlighter style={lucario}>
                        {file.sourceCode}
                    </SyntaxHighlighter>
                </TabsContent>))}
            </Tabs>
        </div>
    )
}

export default FileReferences