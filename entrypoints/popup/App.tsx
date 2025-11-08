import AppHeader from "@/components/widgets/popup/appHeader";
import Settings from "@/components/widgets/popup/settings";
import { Container } from "./Container";
import { ConfigStoreProvider } from "@/store/configStore";
import "@/assets/tailwind.css";
function App() {
  return (
    <ConfigStoreProvider>
      <Container>
        <div className={`w-[350px] min-h-[600px] p-4 bg-background`}>
          <AppHeader />
          <Settings />
        </div>
      </Container>
    </ConfigStoreProvider>
  );
}

export default App;
