import { useEffect, useRef, useState } from 'react'
import {
  Luggage,
  Backpack,
  Plus,
  X,
  MoreHorizontal,
  Star,
} from 'lucide-react'
import './Editor.css'

// 示範清單內容
const template = [
  {
    id: 'suitcase',
    name: '行李箱',
    categories: [
      {
        id: 'other',
        name: '無分類',
        color: '#eeeeee',
        items: ['髮油', '梳子', '酒精', '電棒捲', '口罩'],
      },
      {
        id: 'clothes',
        name: '衣物類',
        color: '#fbf4ce',
        items: ['上衣', '褲子', '內衣褲', '襪子', '鞋子', '外套'],
      },
      {
        id: 'wash',
        name: '盥洗類',
        color: '#e5d9ff',
        items: ['牙刷', '牙膏', '毛巾', '洗面乳'],
      },
      {
        id: 'makeup',
        name: '化妝品',
        color: '#f5d6ce',
        items: [
          '防曬',
          '口紅',
          '粉餅',
          '蜜粉',
          '睫毛膏',
          '腮紅',
          '眼線筆',
          '定妝噴霧',
          '卸妝棉片',
          '化妝水',
        ],
      },
    ],
  },
  {
    id: 'backpack',
    name: '隨身包包',
    categories: [
      {
        id: 'essentials',
        name: '出國必備',
        color: '#f9dfc9',
        items: [
          '護照',
          '信用卡／外幣',
          '萬用轉接頭',
          '機票／電子憑證',
          '網卡／eSIM',
        ],
      },
    ],
  },
]

// 為每個物品建立識別碼及勾選狀態
function createInitialBags() {
  return template.map((bag) => ({
    ...bag,
    categories: bag.categories.map((category) => ({
      ...category,
      items: category.items.map((name) => ({
        id: crypto.randomUUID(),
        name,
        checked: false,
      })),
    })),
  }))
}

function Editor({ trip }) {
  const [bags, setBags] = useState(createInitialBags)
  const [isFavorite, setIsFavorite] = useState(false)
  const pageRef = useRef(null)
  const boardsRef = useRef(null)

  // 控制編輯頁的捲動方式
  useEffect(() => {
    const pageElement = pageRef.current
    const boardsElement = boardsRef.current

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleWheel(event) {
      // 保留 Ctrl + 滾輪的縮放功能
      if (event.ctrlKey) return

      // 觸控板左右滑動時，使用原本的行為
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      const card =
        event.target instanceof Element
          ? event.target.closest('.category-card')
          : null

      // 物品太多時，允許在卡片裡上下捲動
      if (card && card.scrollHeight > card.clientHeight) {
        const canScrollDown =
          card.scrollTop + card.clientHeight < card.scrollHeight - 1

        const canScrollUp = card.scrollTop > 0

        if (
          (event.deltaY > 0 && canScrollDown) ||
          (event.deltaY < 0 && canScrollUp)
        ) {
          return
        }
      }

      // 將上下滾輪轉成左右捲動
      event.preventDefault()

      let multiplier = 1

      if (event.deltaMode === 1) {
        multiplier = 20
      } else if (event.deltaMode === 2) {
        multiplier = boardsElement.clientWidth
      }

      boardsElement.scrollLeft += event.deltaY * multiplier
    }

    pageElement.addEventListener('wheel', handleWheel, {
      passive: false,
    })

    // 離開編輯頁時，恢復原本的頁面捲動
    return () => {
      pageElement.removeEventListener('wheel', handleWheel)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // 更新指定包包、指定分類的物品
  function updateItems(bagId, categoryId, change) {
    setBags((previous) =>
      previous.map((bag) => {
        if (bag.id !== bagId) return bag

        return {
          ...bag,
          categories: bag.categories.map((category) => {
            if (category.id !== categoryId) return category

            return {
              ...category,
              items: change(category.items),
            }
          }),
        }
      })
    )
  }

  // 切換物品的勾選狀態
  function toggleItem(bagId, categoryId, itemId) {
    updateItems(bagId, categoryId, (items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, checked: !item.checked }
          : item
      )
    )
  }

  // 刪除物品
  function removeItem(bagId, categoryId, itemId) {
    updateItems(bagId, categoryId, (items) =>
      items.filter((item) => item.id !== itemId)
    )
  }

  // 新增物品
  function addItem(event, bagId, categoryId) {
    event.preventDefault()

    const formElement = event.currentTarget
    const input = formElement.elements.namedItem('itemName')
    const name = input.value.trim()

    if (!name) return

    const newItem = {
      id: crypto.randomUUID(),
      name,
      checked: false,
    }

    updateItems(bagId, categoryId, (items) => [
      ...items,
      newItem,
    ])

    formElement.reset()
  }

  function addCategory(bagId) {
    const name = window.prompt('請輸入類別名稱')

    // 按取消或沒有輸入文字，就不新增
    if (!name?.trim()) return

    const newCategory = {
        id: crypto.randomUUID(),
        name: name.trim(),
        color: '#eeeeee',
        items: [],
    }

    setBags((previous) =>
        previous.map((bag) =>
        bag.id === bagId
            ? {
                ...bag,
                categories: [...bag.categories, newCategory],
            }
            : bag
        )
    )
    }
  return (
    <div className="editor-page" ref={pageRef}>
      {/* 行程日期與名稱 */}
      <div className="editor-heading">
        <div>
          <p className="editor-dates">
            {trip.startDate} - {trip.endDate}
          </p>

          <div className="editor-title-row">
            <button
                type="button"
                className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                aria-label={isFavorite ? '取消常用行李' : '設為常用行李'}
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite(!isFavorite)}
            >
                <Star
                size={20}
                fill={isFavorite ? 'currentColor' : 'none'}
                />
            </button>

            <h1>{trip.name}</h1>
          </div>
        </div>
      </div>

      {/* 可以左右捲動的包包區 */}
      <div className="editor-boards" ref={boardsRef}>
        {bags.map((bag) => (
          <section className="bag-board" key={bag.id}>
            {/* 包包標題 */}
            <div className="bag-board-heading">
                {bag.id === 'suitcase' ? (
                    <Luggage size={22} />
                ) : (
                    <Backpack size={22} />
                )}

                <h2>{bag.name}</h2>

                <button
                    type="button"
                    className="add-category-button"
                    onClick={() => addCategory(bag.id)}
                >
                    <Plus size={16} />
                    新增類別
                </button>
            </div>

            {/* 分類卡片 */}
            <div className="category-list">
              {bag.categories.map((category) => (
                <section
                  className="category-card"
                  key={category.id}
                >
                  {/* 分類名稱與完成數量 */}
                  <div className="category-heading">
                    <h3
                      style={{
                        backgroundColor: category.color,
                      }}
                    >
                      {category.name}
                    </h3>

                    <span className="category-count">
                      {
                        category.items.filter(
                          (item) => item.checked
                        ).length
                      }
                      {' / '}
                      {category.items.length}
                    </span>

                    <MoreHorizontal
                      className="category-more"
                      size={18}
                      aria-hidden="true"
                    />
                  </div>

                  {/* 物品清單 */}
                  <ul className="packing-items">
                    {category.items.map((item) => (
                      <li key={item.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() =>
                              toggleItem(
                                bag.id,
                                category.id,
                                item.id
                              )
                            }
                          />

                          <span
                            className={
                              item.checked ? 'is-packed' : ''
                            }
                          >
                            {item.name}
                          </span>
                        </label>

                        <button
                          type="button"
                          className="remove-item"
                          aria-label={`刪除${item.name}`}
                          onClick={() =>
                            removeItem(
                              bag.id,
                              category.id,
                              item.id
                            )
                          }
                        >
                          <X size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* 輸入後按 Enter 或加號新增 */}
                  <form
                    className="add-item-form"
                    onSubmit={(event) =>
                      addItem(event, bag.id, category.id)
                    }
                  >
                    <button
                      type="submit"
                      aria-label="新增物品"
                    >
                      <Plus size={20} />
                    </button>

                    <input
                      name="itemName"
                      placeholder="新增物品"
                      aria-label={`新增${category.name}物品`}
                      autoComplete="off"
                    />
                  </form>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Editor