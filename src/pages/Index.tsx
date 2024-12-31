import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const WORTHINESS_QUESTIONS = [
  {
    question: "What drives your pursuit of the unknown?",
    options: ["Power", "Knowledge", "Truth", "Enlightenment"],
  },
  {
    question: "In the darkness, what do you seek?",
    options: ["Light", "Understanding", "Control", "Peace"],
  },
  {
    question: "When faced with forbidden knowledge, do you...?",
    options: ["Embrace it", "Study it", "Share it", "Guard it"],
  },
];

const Index = () => {
  const [stage, setStage] = useState<"question" | "name" | "complete">("question");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sacredName, setSacredName] = useState("");
  const { toast } = useToast();

  const currentQuestion = WORTHINESS_QUESTIONS[questionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (questionIndex < WORTHINESS_QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setStage("name");
    }
    toast({
      title: "The void acknowledges your choice...",
      description: `You have chosen: ${answer}`,
    });
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sacredName.length < 3) {
      toast({
        title: "The void rejects this name",
        description: "Your sacred name must be at least 3 characters long",
        variant: "destructive",
      });
      return;
    }
    setStage("complete");
    toast({
      title: "The void accepts your offering",
      description: `Welcome, ${sacredName}, to the Cult-iverse`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cultDark relative overflow-hidden">
      <div className="sacred-pattern absolute inset-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-cultWhite mb-4">
            Cult-iverse
          </h1>
          <p className="text-lg text-cultWhite/80">
            {stage === "question" && "Prove your worthiness..."}
            {stage === "name" && "Consecrate your sacred name..."}
            {stage === "complete" && "You have been chosen..."}
          </p>
        </div>

        <div className="bg-cultPurple/30 backdrop-blur-sm p-8 rounded-lg border border-cultGlow/30 glow-border">
          {stage === "question" && (
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-cinzel mb-4">{currentQuestion.question}</h2>
              <div className="grid gap-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className="w-full text-left hover:bg-cultGlow/20 transition-colors"
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {stage === "name" && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleNameSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="sacredName" className="block text-sm font-medium">
                  Enter your sacred name
                </label>
                <input
                  type="text"
                  id="sacredName"
                  value={sacredName}
                  onChange={(e) => setSacredName(e.target.value)}
                  className="w-full px-4 py-2 bg-cultDark border border-cultGlow/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cultGlow/50"
                  placeholder="Enter your sacred name..."
                />
              </div>
              <Button type="submit" className="w-full bg-cultGlow hover:bg-cultGlow/80">
                Consecrate Name
              </Button>
            </motion.form>
          )}

          {stage === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <h2 className="text-2xl font-cinzel">Welcome, {sacredName}</h2>
              <p className="text-cultWhite/80">
                Your journey in the Cult-iverse begins now...
              </p>
              <Button className="w-full bg-cultGlow hover:bg-cultGlow/80">
                Enter the Void
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;