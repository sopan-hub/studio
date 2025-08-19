
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2, Upload, FileText, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteContent, setNoteContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSaveNote = () => {
        if (!noteContent.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Note content cannot be empty.' });
            return;
        }
        setLoading(true);
        // Simulate saving
        setTimeout(() => {
            const newNote: Note = {
                id: `note_${Date.now()}`,
                title: noteContent.substring(0, 30) + '...',
                content: noteContent,
                createdAt: new Date(),
            };
            setNotes([newNote, ...notes]);
            setNoteContent('');
            setLoading(false);
            toast({ title: 'Success', description: 'Your note has been saved.' });
        }, 1000);
    };

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
        toast({ title: 'Success', description: 'Note deleted.' });
    };

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Note</CardTitle>
                        <CardDescription>Upload a file or paste text to create a new note.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="paste">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="paste">Paste Text</TabsTrigger>
                                <TabsTrigger value="upload">Upload File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="paste" className="mt-4">
                                <Textarea 
                                    placeholder="Paste your notes here..." 
                                    className="min-h-[200px]"
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                                <Button onClick={handleSaveNote} disabled={loading} className="w-full mt-4">
                                    {loading ? <Loader2 className="animate-spin" /> : 'Save Note'}
                                </Button>
                            </TabsContent>
                            <TabsContent value="upload" className="mt-4">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                    <Upload className="h-12 w-12 text-muted-foreground"/>
                                    <p className="mt-4 text-muted-foreground">Drag & drop files or</p>
                                    <Button variant="outline" className="mt-2">Browse Files</Button>
                                    <p className="text-xs text-muted-foreground mt-2">Supports: PDF, DOCX, TXT</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>My Notes</CardTitle>
                        <CardDescription>Here are all your saved study materials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {notes.length === 0 ? (
                           <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-12 text-center">
                               <FileText className="h-12 w-12 text-muted-foreground"/>
                               <p className="mt-4 text-muted-foreground font-semibold">No notes yet!</p>
                               <p className="text-sm text-muted-foreground mt-1">Add your first note to get started.</p>
                           </div>
                       ) : (
                           <div className="space-y-4">
                               {notes.map(note => (
                                   <Card key={note.id} className="flex items-center justify-between p-4">
                                       <div>
                                           <h3 className="font-semibold">{note.title}</h3>
                                           <p className="text-sm text-muted-foreground">
                                               Created on: {note.createdAt.toLocaleDateString()}
                                           </p>
                                       </div>
                                       <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                                           <Trash2 className="h-5 w-5 text-destructive" />
                                       </Button>
                                   </Card>
                               ))}
                           </div>
                       )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
