
'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateSoothingVideo} from '@/ai/flows/generate-soothing-video';
import {Loader} from 'lucide-react';
import {ArrowLeft} from 'lucide-react';
import Link from 'next/link';

export default function SoothingVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setVideoUrl('');
    try {
      const result = await generateSoothingVideo(prompt);
      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
      } else {
        setError('Failed to generate video. Please try again.');
      }
    } catch (e: any) {
      setError('Error: ' + e.message);
    }
    setLoading(false);
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
          <CardTitle className="text-3xl font-bold tracking-tight">Generate a Soothing Video</CardTitle>
          <CardDescription className="text-lg">
            Enter a prompt to generate a soothing video with AI. For example, "a calm beach at sunset".
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter your prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleGenerate} disabled={loading}>
              {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Generating...' : 'Generate Video'}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            {videoUrl && (
              <div className="mt-4">
                <video controls src={videoUrl} className="w-full rounded-lg" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
