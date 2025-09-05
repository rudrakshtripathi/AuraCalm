
'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {findYoutubeVideo, availableVideos} from '@/ai/flows/find-youtube-video';
import {Loader, Wand2} from 'lucide-react';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';

const examplePrompts = [
  'Peaceful beach with gentle waves and sunset',
  'Serene forest with sunlight filtering through trees',
  'Calm mountain lake with sky reflection',
  'Cozy fireplace with crackling sounds',
  'Lush green nature scenes with relaxing music',
  'Gentle rain sounds for sleeping',
  'Beautiful lavender fields in Provence, France'
];


export default function SoothingVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt to find a video.');
      return;
    }
    setLoading(true);
    setError('');
    setVideoUrl('');
    try {
      const result = await findYoutubeVideo(prompt);
      const selectedVideo = availableVideos.find(v => v.description === result.videoDescription);

      if (selectedVideo) {
        setVideoUrl(`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`);
      } else {
        setError('Failed to find a matching video. Please try a different description.');
      }
    } catch (e: any) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl relative">
        <Link href="/" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </Button>
        </Link>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Find a Soothing Scene</CardTitle>
          <CardDescription className="text-lg">
            Describe a calming scene and let AI find a YouTube video for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g., A calm beach at sunset with gentle waves"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={loading}
              />
               <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                    <Button key={example} variant="outline" size="sm" onClick={() => handleExampleClick(example)} disabled={loading}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {example}
                    </Button>
                ))}
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} size="lg">
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Finding...' : 'Find Scene'}
            </Button>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {videoUrl && (
              <div className="mt-4 rounded-lg overflow-hidden shadow-lg aspect-video">
                <iframe 
                  src={videoUrl} 
                  title="Soothing Video"
                  className="w-full h-full"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
