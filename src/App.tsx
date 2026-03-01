import { ThemeProvider } from "./components/theme-provider";
import { AudioProvider } from "./components/audio-provider";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./page/Layout";
import { HomePage } from "./page/Home";
import { Game } from "./page/Game";
import { QuizPage } from "./page/Quiz";
import { CoinProvider } from "./components/coin-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AudioProvider>
        <CoinProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:level" element={<Game />} />
                <Route path="/quiz" element={<QuizPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CoinProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
