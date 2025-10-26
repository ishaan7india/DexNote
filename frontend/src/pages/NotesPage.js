import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CanvasDraw from 'react-canvas-draw';
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
  Trash2,
  Save,
  Eraser,
} from 'lucide-react';

const NotesPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(2);

  const editor = useEditor({
    extensions: [StarterKit],
    content: 'Start writing your notes here...',
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNote = () => {
    if (editor && editor.getHTML()) {
      const canvasData = canvasRef.current?.getSaveData();
      const newNote = {
        id: currentNote?.id || Date.now(),
        content: editor.getHTML(),
        canvas: canvasData,
        timestamp: new Date().toISOString(),
      };

      const updatedNotes = currentNote
        ? notes.map((n) => (n.id === currentNote.id ? newNote : n))
        : [...notes, newNote];

      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setCurrentNote(newNote);
    }
  };

  const loadNote = (note) => {
    setCurrentNote(note);
    if (editor) {
      editor.commands.setContent(note.content);
    }
    if (canvasRef.current && note.canvas) {
      canvasRef.current.loadSaveData(note.canvas);
    }
  };

  const createNewNote = () => {
    setCurrentNote(null);
    if (editor) {
      editor.commands.setContent('Start writing your notes here...');
    }
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (currentNote?.id === noteId) {
      createNewNote();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const undoCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">My Notes</h1>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Notes List Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl">All Notes</CardTitle>
              <Button onClick={createNewNote} className="w-full mt-2">
                Create New Note
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentNote?.id === note.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div onClick={() => loadNote(note)} className="flex-1">
                      <div
                        className="text-sm font-medium line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: note.content.substring(0, 100),
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No notes yet. Create your first note!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Editor and Canvas */}
          <div className="lg:col-span-3 space-y-4">
            {/* Rich Text Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Text Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    variant={editor.isActive('bold') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    variant={editor.isActive('italic') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Heading1 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                    size="sm"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    variant="outline"
                    size="sm"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    variant="outline"
                    size="sm"
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
                <EditorContent
                  editor={editor}
                  className="prose max-w-none min-h-[300px] p-4 border rounded-lg bg-white"
                />
              </CardContent>
            </Card>

            {/* Whiteboard/Canvas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Whiteboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Color:</label>
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="h-8 w-16 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Brush Size:</label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushRadius}
                      onChange={(e) => setBrushRadius(parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="text-sm">{brushRadius}px</span>
                  </div>
                  <Button onClick={undoCanvas} variant="outline" size="sm">
                    <Undo className="h-4 w-4 mr-1" />
                    Undo
                  </Button>
                  <Button onClick={clearCanvas} variant="outline" size="sm">
                    <Eraser className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <div className="border rounded-lg bg-white overflow-hidden">
                  <CanvasDraw
                    ref={canvasRef}
                    brushColor={brushColor}
                    brushRadius={brushRadius}
                    canvasWidth={800}
                    canvasHeight={400}
                    lazyRadius={0}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={saveNote} className="w-full" size="lg">
              <Save className="h-5 w-5 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
