import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'

// createRootメソッドを使用し、index.html内の<div id="root">という要素を取得、それをreactルートにしている
// as Element => 取得したHTML要素をas Elementとして型アサーションしている
// 型アサーション => 型推論を上書きして別の型を割り当てる機能
const root = createRoot(document.getElementById("root") as Element);

// reactルートが盛るrenderメソッドは、DOM内部へreact要素である<App />コンポーネントをレンダリング
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
