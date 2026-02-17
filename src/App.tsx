import { ThemeProvider } from "./components/theme-provider";
import { AudioProvider } from "./components/audio-provider";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./page/Layout";
import { HomePage } from "./page/Home";
import { Game } from "./page/Game";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AudioProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:level" element={<Game />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AudioProvider>
    </ThemeProvider>
  );
}

export default App;
