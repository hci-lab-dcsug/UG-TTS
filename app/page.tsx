"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Wand2, BarChart3, Home } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">DCS-HCI NLP Suite</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            NLP Tools for Local Languages
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TTS Card */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/tts")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-blue-500" />
                Text-to-Speech
              </CardTitle>
              <CardDescription>Convert text to natural-sounding speech using advanced TTS models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">Multi-Speaker Support</Badge>
                <Badge variant="secondary">Adjustable Speech Rate</Badge>
                <Badge variant="secondary">Multiple Models</Badge>
              </div>
              <Button className="w-full">
                <Volume2 className="h-4 w-4 mr-2" />
                Start Synthesis
              </Button>
            </CardContent>
          </Card>

          {/* Spell Check Card */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/spellcheck")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-green-500" />
                Spell Check
              </CardTitle>
              <CardDescription>Automatically correct spelling errors in Akan text before synthesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">Word-level Correction</Badge>
                <Badge variant="secondary">Sentence Correction</Badge>
                <Badge variant="secondary">Model Selection</Badge>
              </div>
              <Button className="w-full">
                <Wand2 className="h-4 w-4 mr-2" />
                Check Spelling
              </Button>
            </CardContent>
          </Card>

          {/* Evaluation Card */}
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => (window.location.href = "/tts/evaluation")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-500" />
                TTS Evaluation
              </CardTitle>
              <CardDescription>Participate in quality evaluation studies to improve TTS models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary">MOS Rating</Badge>
                <Badge variant="secondary">Audio Comparison</Badge>
                <Badge variant="secondary">User Feedback</Badge>
              </div>
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Start Evaluation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Advanced TTS Engine</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple model support with dynamic loading</li>
                <li>• Per-speaker synthesis capabilities</li>
                <li>• Adjustable speech rate and quality settings</li>
                <li>• Audio delivery via file download or JSON API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Intelligent Spell Checking</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Single-word and full-sentence correction</li>
                <li>• Multiple correction models available</li>
                <li>• Before/after comparison display</li>
                <li>• Seamless integration with TTS synthesis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Comprehensive Evaluation</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mean Opinion Score (MOS) rating system</li>
                <li>• Reference audio comparison</li>
                <li>• UUID-based sample management</li>
                <li>• Quality assessment and feedback collection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Storage & Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Organized output storage system</li>
                <li>• Download and retrieval capabilities</li>
                <li>• Model configuration management</li>
                <li>• Health monitoring and diagnostics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => (window.location.href = "/tts")}>
              <Volume2 className="h-4 w-4 mr-2" />
              Synthesize Text
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/spellcheck")}>
              <Wand2 className="h-4 w-4 mr-2" />
              Check Spelling
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/tts/evaluation")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Evaluate Quality
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
