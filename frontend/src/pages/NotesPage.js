import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your notes here...</p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const saveNote = () => {
    if (editor) {
      const content = editor.getHTML();
      const newNote = {
        id: Date.now(),
        content,
        title: 'New Note',
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
      editor.commands.setContent('<p>Start writing your notes here...</p>');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notes yet. Create your first note!</p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => setCurrentNote(note)}
                    >
                      <p className="font-medium">{note.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Notion-like Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <MenuBar />
                <EditorContent editor={editor} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={saveNote}>Save Note</Button>
                <Button
                  variant="outline"
                  onClick={() => editor?.commands.setContent('<p>Start writing your notes here...</p>')}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
