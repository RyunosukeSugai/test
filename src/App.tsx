import { useState } from "react";

type Todo = {
  value: string;
  readonly id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = 'all' | 'checked' | 'unchecked' | 'removed';

// jsxで作成したTodo作成した入力フォームをreturnする
// コンポーネントはアッパーキャメルケースで記載する
export const App = () => {

  const [text, setText] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');

  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  }

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return !todo.removed;
      case 'checked':
        return todo.checked && !todo.removed;
      case 'unchecked':
        return !todo.checked && !todo.removed;
      case 'removed':
        return todo.removed;
      default:
        return todo;
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
    id: number,
    key: K,
    value: V
  ) => {
    setTodos((todos) => {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {...todo, [key]: value};
        } else {
          return todo;
        }
      });
      return newTodos;
    })
  }

  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  }

  // todos ステートを更新する関数
  const handleSubmit = () => {
    // 何も入力されていなかったらリターン
    if (!text) return;

    // 新しい Todo を作成
    // 明示的に型注釈を付けてオブジェクトの型を限定する
    const newTodo: Todo = {
      // text ステートの値を value プロパティへ
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    /**
     * 更新前の todos ステートを元に
     * スプレッド構文で展開した要素へ
     * newTodo を加えた新しい配列でステートを更新
     **/
    setTodos((todos) => [newTodo, ...todos]);
    // フォームへの入力をクリアする
    setText('');
  };


  // jsxが複数行に渡る場合（）で囲む必要がある
  // 必ず単一のjsx要素であること
  // <div>を使用したくない場合などは、<>jsxフラグメントを使用すること
  // jsx内のonsubmitイベントはろわーキャメルケースでの記載を行うこと
  // jsx文中にjavascript変数の値を展開するためには{}で囲む必要がある
  return (
    <div>
      <select
        defaultValue="all"
        onChange={(e) => handleFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ゴミ箱</option>
      </select>
      {filter === 'removed' ? (
        <button
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        filter !== 'checked' && (
          <form
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit();
              }}
            >
            <input
              type="text"
              value={text}
              onChange={(e) => handleChange(e)}
            />
            <input
              type="submit"
              value="追加"
              onSubmit={handleSubmit}
            />
          </form>
        )
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.checked}
                disabled={todo.removed}
                onChange={() => handleTodo(todo.id, 'checked' ,!todo.checked)}
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) => handleTodo(todo.id, 'value' ,e.target.value)}
              />
              <button onClick={() => handleTodo(todo.id, 'removed' , !todo.removed)}>
                {todo.removed ? '復元' : '削除'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  );
}