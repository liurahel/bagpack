import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, CircleUserRound } from 'lucide-react'
import './Createtrip.css'

const purposes = ['國內旅遊', '出國旅遊', '出差', '登山', '滑雪', '其他']
const dietOptions = ['葷食', '不吃牛', '不吃豬', '不吃海鮮', '蛋奶素', '全素']
const healthOptions = ['日常備用藥', '暈車／暈船藥', '過敏用藥']

function Createtrip({ onClose, onComplete }) {
  const dialogRef = useRef(null)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    purposes: [],
    name: '',
    startDate: '',
    endDate: '',
    destination: '',
    arrangement: '',
    nickname: '',
    age: '',
    gender: '',
    diet: [],
    dietOther: '',
    health: [],
    healthOther: '',
  })

  // 視窗出現時開啟，並暫停背景頁面捲動
  useEffect(() => {
    dialogRef.current.showModal()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // 更新文字、日期、下拉選單等單一欄位
  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  // 更新可複選的項目
  function toggleOption(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: previous[field].includes(value)
        ? previous[field].filter((item) => item !== value)
        : [...previous[field], value],
    }))
  }

  const canContinue =
    form.purposes.length > 0 &&
    form.name.trim() !== '' &&
    form.startDate !== '' &&
    form.endDate !== '' &&
    form.endDate >= form.startDate &&
    form.destination.trim() !== '' &&
    form.arrangement !== ''

  function finish(skipPersonal = false) {
    onComplete({
      id: crypto.randomUUID(),
      name: form.name.trim(),
      type: form.purposes.join('、'),
      startDate: form.startDate,
      endDate: form.endDate,
      destination: form.destination.trim(),
      arrangement: form.arrangement,
      personal: skipPersonal
        ? null
        : {
            nickname: form.nickname,
            age: form.age,
            gender: form.gender,
            diet: form.diet,
            dietOther: form.dietOther,
            health: form.health,
            healthOther: form.healthOther,
          },
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (step === 1) {
      if (canContinue) setStep(2)
    } else {
      finish()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="create-modal"
      aria-labelledby="create-modal-title"
      onCancel={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className="create-modal-heading">
          <div>
            <h2 id="create-modal-title">
              建立新行李 - {step === 1 ? '行程規劃' : '個人化設定'}
            </h2>

            <p>
              {step === 1
                ? '依據行程規劃提供更合適的行李建議'
                : '依據個人習慣偏好提供更完善的行李建議'}
            </p>
          </div>

          {step === 2 && (
            <button
              type="button"
              className="create-skip"
              onClick={() => finish(true)}
            >
              暫時略過
            </button>
          )}
        </div>

        {step === 1 ? (
          <div className="create-modal-body">
            <fieldset className="create-purposes">
              <legend>打包目的 <span>（可複選）</span></legend>

              <div className="purpose-options">
                {purposes.map((purpose) => (
                  <button
                    key={purpose}
                    type="button"
                    className={
                      form.purposes.includes(purpose) ? 'selected' : ''
                    }
                    aria-pressed={form.purposes.includes(purpose)}
                    onClick={() => toggleOption('purposes', purpose)}
                  >
                    {purpose === '其他' ? '＋其他' : purpose}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="create-fields">
              <label className="create-field">
                <span>行程名稱</span>
                <input
                  placeholder="為你的行程命名"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                />
              </label>

              <div className="create-field">
                <span>開始日期 - 結束日期</span>
                <div className="create-dates">
                  <input
                    type="date"
                    aria-label="開始日期"
                    value={form.startDate}
                    onChange={(event) =>
                      updateField('startDate', event.target.value)
                    }
                    required
                  />
                  <span>－</span>
                  <input
                    type="date"
                    aria-label="結束日期"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(event) =>
                      updateField('endDate', event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <label className="create-field">
                <span>目的地</span>
                <input
                  placeholder="請輸入你的目的地"
                  value={form.destination}
                  onChange={(event) =>
                    updateField('destination', event.target.value)
                  }
                  required
                />
              </label>

              <label className="create-field">
                <span>行程安排</span>
                <select
                  value={form.arrangement}
                  onChange={(event) =>
                    updateField('arrangement', event.target.value)
                  }
                  required
                >
                  <option value="">請選擇你的行程安排方式</option>
                  <option>獨自前往／獨旅</option>
                  <option>與親友同行</option>
                  <option>跟團旅遊</option>
                  <option>其他</option>
                </select>
              </label>
            </div>
          </div>
        ) : (
          <div className="create-modal-body">
            <div className="personal-top">
              <CircleUserRound
                className="personal-avatar"
                size={112}
                strokeWidth={1}
                aria-hidden="true"
              />

              <div className="personal-fields">
                <label className="personal-row">
                  <span>姓名</span>
                  <input
                    placeholder="請輸入姓名或暱稱"
                    value={form.nickname}
                    onChange={(event) =>
                      updateField('nickname', event.target.value)
                    }
                  />
                </label>

                <label className="personal-row">
                  <span>年齡區間</span>
                  <select
                    value={form.age}
                    onChange={(event) =>
                      updateField('age', event.target.value)
                    }
                  >
                    <option value="">請選擇年齡區間</option>
                    <option>未滿18歲</option>
                    <option>成年（18～64歲）</option>
                    <option>65歲以上</option>
                  </select>
                </label>

                <fieldset className="personal-gender">
                  <legend>性別</legend>
                  <div className="check-options">
                    {['男性', '女性', '不方便透露'].map((gender) => (
                      <label key={gender}>
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          checked={form.gender === gender}
                          onChange={() => updateField('gender', gender)}
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="personal-preferences">
              <fieldset>
                <legend>飲食偏好 <span>（可複選）</span></legend>
                <div className="check-options">
                  {dietOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={form.diet.includes(option)}
                        onChange={() => toggleOption('diet', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <label className="other-option">
                  其他：
                  <input
                    value={form.dietOther}
                    onChange={(event) =>
                      updateField('dietOther', event.target.value)
                    }
                  />
                </label>
              </fieldset>

              <fieldset>
                <legend>健康與生理需求 <span>（可複選）</span></legend>
                <div className="check-options">
                  {healthOptions.map((option) => (
                    <label key={option}>
                      <input
                        type="checkbox"
                        checked={form.health.includes(option)}
                        onChange={() => toggleOption('health', option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <label className="other-option">
                  其他：
                  <input
                    value={form.healthOther}
                    onChange={(event) =>
                      updateField('healthOther', event.target.value)
                    }
                  />
                </label>
              </fieldset>
            </div>

            <p className="personal-note">＊此區可依個人偏好選填</p>
          </div>
        )}

        <div className="create-modal-footer">
          {step === 1 ? (
            <button
              type="button"
              className="create-cancel"
              onClick={onClose}
            >
              取消
            </button>
          ) : (
            <button
              type="button"
              className="create-step-button"
              onClick={() => setStep(1)}
            >
              <ChevronLeft size={20} />
              上一步
            </button>
          )}

          <button
            type="submit"
            className={`create-step-button ${
              step === 2 || canContinue ? 'is-ready' : ''
            }`}
            disabled={step === 1 && !canContinue}
          >
            {step === 1 ? '下一步' : '完成'}
            {step === 1 && <ChevronRight size={20} />}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Createtrip