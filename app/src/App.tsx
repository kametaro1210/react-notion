import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Home from './pages/Home';
import NoteDetail from './pages/NoteDetail';
import Signin from './pages/Signin';
import Signup from './pages/Signup';


function App() {

  /*
    【各コンポーネントの役割】
    - BrowserRouter
      ブラウザーのURLを使って画面を切り替えるための範囲を作る。
      この範囲内でURLが変わると、ページ全体を読み込み直さずに表示を切り替えられる。
    - Routes
      現在のURLに合うRouteを探し、合ったRouteのelementを画面に表示する。
    - Route
      どのURLでどの画面を表示するかを定義する。
      pathは照合するURL、elementはURLが合ったときに表示するコンポーネント。

    【処理フロー】
    1. BrowserRouterがブラウザーのURLを確認できるようにする。
    2. Routesが現在のURLとRouteのpathを照合する。
    3. URLが"/signin"なら、pathが"/signin"のRouteに合うためSigninを表示する。
        URLが"/signup"なら、pathが"/signup"のRouteに合うためSignupを表示する。
    4. URLが"/"なら、親のRouteに合うためLayoutを表示する。
        さらに、親Routeと同じURLに合うindex RouteによってHomeも表示する。
    5. 親画面（Layout）の中にある <Outlet/> は、子画面（Home）を表示するための専用の「差し込み口（穴）」です。
        例 : URLが / のときは、その穴に Home が自動的にはめ込まれて表示されます。
  */

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
