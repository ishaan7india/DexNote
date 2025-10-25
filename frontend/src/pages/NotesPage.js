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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(2);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: 'Start writing your notes here...',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
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

  const saveCanvas = () => {
    if (canvasRef.current) {
      const data = canvasRef.current.getSaveData();
      localStorage.setItem('whiteboard_data', data);
      alert('Whiteboard saved successfully!');
    }
  };

  const loadCanvas = () => {
    if (canvasRef.current) {
      const data = localStorage.getItem('whiteboard_data');
      if (data) {
        canvasRef.current.loadSaveData(data);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && canvasRef.current) {
      loadCanvas();
    }
  }, [isAuthenticated]);

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b p-2 flex flex-wrap gap-2">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('code') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // If not authenticated, show login/signup prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              Please sign in or create an account to access notes and whiteboard features.
            </p>
            <div className="flex gap-4">
              <Button onClick={handleLoginRedirect} className="flex-1">
                Login
              </Button>
              <Button onClick={handleSignupRedirect} variant="outline" className="flex-1">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Notes & Whiteboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Editor Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notes Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <MenuBar />
            <EditorContent editor={editor} />
          </CardContent>
        </Card>

        {/* Whiteboard Section */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Whiteboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Whiteboard Controls */}
              <div className="flex flex-wrap gap-2 items-center">
                <label className="text-sm font-medium">Brush Color:</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-12 h-8 cursor-pointer"
                />
                
                <label className="text-sm font-medium ml-4">Brush Size:</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={brushRadius}
                  onChange={(e) => setBrushRadius(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm">{brushRadius}px</span>
              </div>

              {/* Canvas */}
              <div className="border border-gray-300 rounded">
                <CanvasDraw
                  ref={canvasRef}
                  brushColor={brushColor}
                  brushRadius={brushRadius}
                  lazyRadius={0}
                  canvasWidth={"100%"}
                  canvasHeight={400}
                  hideGrid={false}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={undoCanvas} variant="outline" size="sm">
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button onClick={clearCanvas} variant="outline" size="sm">
                  <Eraser className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button onClick={saveCanvas} variant="default" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotesPage;
