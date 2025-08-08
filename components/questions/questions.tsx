"use client"

import useProject from "@/hooks/use-projects"
import { useGetQuestions } from "./api/api"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import AskQuestion from "../dashboard/ask-question"
import React, { useState } from "react"

import MDEditor from "@uiw/react-md-editor"
import FileReferences from "../dashboard/code-references"
import { Avatar, AvatarImage } from "../ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"

const Questions = () => {
    const { projectId } = useProject()
    const { data: questions, isPending } = useGetQuestions(projectId || "")
    const [questionIndex, setQuestionIndex] = useState(0)
    const question = questions?.[questionIndex]

    return (
        <Sheet>
            <AskQuestion />
            <div className="h-4" />
            <h1 className="text-xl font-semibold">Saved Questions</h1>
            <div className="h-2" />
            <div className="flex gap-2 flex-col">
                {questions?.map((question: any, index: any) => (
                    <React.Fragment key={question.id}>
                        <SheetTrigger onClick={() => setQuestionIndex(index)}>
                            <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                                <Avatar>
                                    <AvatarImage src={question.userImage ? question.userImage : "https://avatars.githubusercontent.com/u/6880091?v=4"} />
                                </Avatar>
                                <div className="text-left flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-gray-700 line-clamp-1 text-lg font-medium">{question.question}</p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(question.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 line-clamp-1 text-sm font-medium">{question.answer}</p>
                                </div>
                            </div>
                        </SheetTrigger>
                    </React.Fragment>
                ))}
            </div>
            {question && (
                <SheetContent className="min-w-[80vw] overflow-y-scroll scrollbar-custom">
                    <SheetHeader>
                        <SheetTitle>
                            {question.question}
                        </SheetTitle>
                        <MDEditor.Markdown source={question.answer} />
                        <FileReferences fileReferences={question.fileReferences ?? []} />
                    </SheetHeader>
                </SheetContent>
            )}
        </Sheet>
    )
}

export default Questions