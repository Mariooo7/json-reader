import { Toolbar } from './components/Toolbar';
import { InputArea } from './components/InputArea';
import { JsonViewer } from './components/JsonViewer';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-border min-w-[300px]">
          <InputArea />
        </div>
        <div className="flex-1 h-2/3 md:h-full overflow-hidden bg-background">
          <JsonViewer />
        </div>
      </div>
    </div>
  );
}

export default App;
