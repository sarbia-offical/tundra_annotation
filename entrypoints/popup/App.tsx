import AppHeader from "@/components/widgets/popup/appHeader";
import Settings from "@/components/widgets/popup/settings";
import { Container } from "./Container";
import "@/assets/tailwind.css";
function App() {
  return (
    <Container>
      <div className={`w-[350px] min-h-[600px] p-4 bg-background`}>
        <AppHeader />
        <Settings />
      </div>
    </Container>
  );
}

export default App;
