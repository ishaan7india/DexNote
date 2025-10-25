import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Wand2, MessageSquare, Image, Code2, FileText, Music } from 'lucide-react';

const AIToolsPage = () => {
  const aiTools = [
    {
      id: 1,
      name: 'ChatGPT',
      category: 'Text Generation',
      description: 'Advanced conversational AI by OpenAI that can help with writing, coding, analysis, and creative tasks.',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      features: ['Natural conversations', 'Code generation', 'Content writing', 'Problem solving']
    },
    {
      id: 2,
      name: 'DALL-E',
      category: 'Image Generation',
      description: 'Create stunning, realistic images from text descriptions using advanced AI image generation.',
      icon: <Image className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      features: ['Text-to-image', 'Image editing', 'Style variations', 'High resolution']
    },
    {
      id: 3,
      name: 'GitHub Copilot',
      category: 'Code Assistant',
      description: 'AI-powered code completion tool that helps you write code faster with intelligent suggestions.',
      icon: <Code2 className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      features: ['Code completion', 'Multi-language support', 'Context-aware', 'Documentation help']
    },
    {
      id: 4,
      name: 'Midjourney',
      category: 'Image Generation',
      description: 'Create beautiful, artistic images with an AI that specializes in creative and aesthetic outputs.',
      icon: <Wand2 className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      features: ['Artistic style', 'High quality', 'Creative control', 'Community features']
    },
    {
      id: 5,
      name: 'Jasper AI',
      category: 'Content Writing',
      description: 'AI writing assistant for marketing copy, blog posts, social media content, and more.',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-teal-500 to-green-500',
      features: ['Marketing copy', 'SEO optimization', 'Multiple templates', 'Tone adjustment']
    },
    {
      id: 6,
      name: 'ElevenLabs',
      category: 'Voice & Audio',
      description: 'Generate realistic voiceovers and clone voices using advanced AI voice synthesis technology.',
      icon: <Music className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      features: ['Text-to-speech', 'Voice cloning', 'Multiple languages', 'Natural prosody']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            DexNote
          </Link>
          <div className="flex gap-4">
            <Link to="/courses">
              <Button variant="ghost" data-testid="nav-courses-btn">Courses</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" data-testid="nav-dashboard-btn">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Brain className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }} data-testid="ai-tools-title">
            AI Tools Directory
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover and master the most powerful AI tools transforming industries. From content creation to code generation, explore the future of productivity.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Popular AI Tools
          </h2>
          <p className="text-slate-600">Learn about the leading AI tools used by professionals worldwide</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ai-tools-grid">
          {aiTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1"
              data-testid={`ai-tool-${tool.id}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center mb-4 text-white`}>
                {tool.icon}
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium mb-3">
                  {tool.category}
                </span>
                <p className="text-slate-600">{tool.description}</p>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-900 mb-2">Key Features:</div>
                {tool.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Want to Learn More About AI Tools?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Check out our comprehensive courses on how to effectively use AI tools in your workflow.
          </p>
          <Link to="/courses">
            <Button size="lg" variant="secondary" data-testid="explore-ai-courses-btn" className="text-lg px-8 py-6">
              Explore AI Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIToolsPage;
