"use client"

import useProject from "@/hooks/use-projects"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import Image from "next/image"
import Logo from "@/public/logo.svg";
import { askQuestion } from "./api/actions"
import { readStreamableValue } from "@ai-sdk/rsc"
import MDEditor from "@uiw/react-md-editor"
import { LoaderTwo } from "../ui/loader"
import FileReferences from "./code-references"
import { useSaveQuestion } from "./api/api"

const AskQuestion = () => {
    const [question, setQuestion] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fileReferences, setFileReferences] = useState<
        { fileName: string; sourceCode: string; summary: string }[]
    >([]);
    const [answer, setAnswer] = useState('')
    const { project } = useProject()

    const { mutate, isPending } = useSaveQuestion();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('')
        setFileReferences([])
        e.preventDefault();
        if (question.trim()) {
            setLoading(true);
            const { output, filesReferences } = await askQuestion(question, project.id);
            setFileReferences(filesReferences);
            for await (const chunk of readStreamableValue(output)) {
                if (chunk) {
                    setOpen(true);
                    setAnswer((ans) => ans + chunk);
                }
            }

            setLoading(false);
        } else {
            toast.error("Please enter a question");
        }
    };

    const saveQuestion = () => {
        mutate({
            projectId: project.id,
            question,
            answer,
            fileReferences
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()} className="min-w-[60vw] max-h-[80vh] overflow-hidden">
                    <DialogHeader>
                        <div className="flex gap-2 justify-center items-center">
                            <DialogTitle className="flex justify-center">
                                <Image src={Logo} alt="Ask Repo" width={120} height={90} />
                            </DialogTitle>
                            <Button disabled={isPending} variant="outline" onClick={() => saveQuestion()}>Save answer</Button>
                        </div>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[60vh] px-2 scrollbar-custom">
                        <MDEditor.Markdown source={answer} className="!bg-transparent" />
                        <FileReferences fileReferences={fileReferences} />
                    </div>
                    <Button disabled={loading} type="button" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>



            <Card className="rel col-span-5">
                <CardHeader>
                    <CardTitle>
                        Ask a questionn
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder="Which file has the logic to upload files?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <div className="h-4"></div>
                        <Button type="submit" disabled={loading}>
                            {
                                loading ?
                                    <div className="flex items-center gap-2">
                                        Analysing <LoaderTwo />
                                    </div>
                                    :
                                    <p className="px-2">
                                        Ask repo
                                    </p>
                            }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestion