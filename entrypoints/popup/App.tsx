import AppHeader from "@/components/widgets/popup/appHeader";
import Settings from "@/components/widgets/popup/settings";
import { StoreProvider } from "@/store/store.context";
function App() {
  return (
    <StoreProvider>
      <div className={`w-[350px] min-h-[600px] p-4 bg-background`}>
        <AppHeader />
        <Settings />
      </div>
    </StoreProvider>
  );
}

export default App;
