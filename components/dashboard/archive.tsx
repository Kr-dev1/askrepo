import React, { useState } from 'react'
import { useArchiveProjects } from './api/api'
import useProject from '@/hooks/use-projects'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const Archive = () => {
    const { projectId } = useProject()
    const { mutate: archiveProject, isPending } = useArchiveProjects(projectId!)
    const [open, setOpen] = useState(false)

    const handleArchive = () => {
        archiveProject()
        setOpen(false)
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        Archive Project
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Archive Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive this project? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleArchive}
                            disabled={isPending}
                        >
                            {isPending ? 'Archiving...' : 'Archive'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Archive