import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './Layout';
import { authRepository } from "./modules/auth/auth.repository";
import { currentUserAtom } from "./modules/auth/current-user.state";
import Home from './pages/Home';
import NoteDetail from './pages/NoteDetail';
import Signin from './pages/Signin';
import Signup from './pages/Signup';


function App() {

  // ユーザー情報の確認中かどうかを表す。最初は確認中(true)にする。
  const [isLoading, setIsLoading] = useState(true);

  // currentUserAtomにユーザー情報を保存するための関数。
  const setCurrentUser = useSetAtom(currentUserAtom);

  // ----------------------------------------------------------------------------------------------

  /*
    ログイン状態の確認処理

    【目的】
    ページを開いたときにログイン中のユーザーを取得し、
    リロード後もログイン状態を画面に反映する。

    【処理フロー】
    1. useEffectは、画面の表示後に行う処理を登録するためのReactの機能。
        依存配列が[]のため、このコンポーネントが表示されたときに一度だけ実行する。
        memo: ユーザー情報を最初に確認すればよく、画面の再描画のたびに取得し直す必要がないため。
    2. authRepository.getCurrentUser()で現在のユーザー情報を取得する。
    3. 取得できたユーザー情報をsetCurrentUserでアプリ内に保存する。
        これにより、リロード後もログイン中のユーザーとして画面を表示できる。
    4. 取得に失敗した場合は、catchでエラーをコンソールに出力する。
    5. finallyは取得に成功した場合も失敗した場合も実行され、
        setIsLoading(false)でユーザー情報の確認を終了する。
    6. 確認中はisLoadingがtrueなので、空の<div />を返して画面表示を待つ。
        確認が終わると下のRoutesに進み、現在のURLに合う画面を表示する。
        memo : ログイン後にHomeへ移動させているのは、この処理ではなく,Signin.tsxのNavigate。
  */

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authRepository.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (isLoading) return <div />;

  // ----------------------------------------------------------------------------------------------

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
