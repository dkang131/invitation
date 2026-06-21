import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "./App.css";

import "react-day-picker/style.css";

import { submitResponse } from "./api";

const proposals = [
  {
    id: 1,
    title: "☕ Coffee After Work",
    date: "2026-08-08",
    time: "19:00",
  },
  {
    id: 2,
    title: "🍰 Dessert & Walk",
    date: "2026-08-09",
    time: "14:00",
  },
  {
    id: 3,
    title: "🌆 Dinner Together",
    date: "2026-08-14",
    time: "19:30",
  },
];

function formatDate(dateString, time) {
  const date = new Date(`${dateString}T${time}`);

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [selectedProposals, setSelectedProposals] =
    useState([]);

  const [customDates, setCustomDates] =
    useState([]);

  const [startTime, setStartTime] =
    useState("18:00");

  const [endTime, setEndTime] =
    useState("22:00");

  // const [showCalendar, setShowCalendar] =
  //   useState(false);
  const [step, setStep] =
    useState("proposal");

  const [note, setNote] = useState("");

  const toggleProposal = (proposal) => {
    const exists = selectedProposals.find(
      (p) => p.id === proposal.id
    );

    if (exists) {
      setSelectedProposals(
        selectedProposals.filter(
          (p) => p.id !== proposal.id
        )
      );
    } else {
      setSelectedProposals([
        ...selectedProposals,
        proposal,
      ]);
    }
  };

  async function handleSubmit() {
    await submitResponse({
      selectedDates: selectedProposals,
      customAvailability: customDates.map(
        (date) => ({
          date: date.toISOString(),
          startTime,
          endTime,
        })
      ),
      note,
    });

    alert("Submitted ❤️");
  }

  return (
    <div className="app">
      <p className="intro">
        Hey Ellen 👋
        <br />
        I'd love to spend some time together.
        I picked a few dates that work for me,
        but feel free to suggest your own if none fit.
      </p>

      <div className="card">
        {step === "proposal" && (
          <>
            <h1 className="title">
              I'd love to take you out sometime
            </h1>
            <p className="subtitle">
                Do any of these dates work?
            </p>
            <div className="proposal-list">
              {proposals.map((proposal) => {
                const isSelected =
                  selectedProposals.some(
                    (p) => p.id === proposal.id
                  );

                return (
                  <label
                    key={proposal.id}
                    className={`proposal-item ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProposal(proposal)}
                    />

                    <div className="proposal-content">
                      <div className="proposal-title">
                        {proposal.title}
                      </div>

                      <div className="proposal-date">
                        {formatDate(
                          proposal.date,
                          proposal.time
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="actions">
              <button
                className="secondary-btn"
                onClick={() => setStep("custom")}
              >
                None of these work 😢
              </button>
            </div>
          </>
        )}
        {step === "custom" && (
          <div className="calendar-section">
            <h2 className="section-title">
              No worries 😊
            </h2>

            <p className="section-subtitle">
              What dates would work better for you?
            </p>

            <div className="calendar-wrapper">
              <DayPicker
                mode="multiple"
                selected={customDates}
                onSelect={setCustomDates}
              />
            </div>

            <div className="time-section">
              <div>
                <label>Start Time</label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                />
              </div>

              <div>
                <label>End Time</label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                />
              </div>
            </div>
            <button
              className="back-btn"
              onClick={() => {
                setCustomDates([]);
                setStep("proposal");
              }}
            >
              ← Actually, one of your suggested dates works 😊
            </button>
          </div>
        )}
        {(
          selectedProposals.length > 0 ||
          step === "custom"
        ) && (
          <div style={{ marginTop: "24px" }}>
            <textarea
              className="note-box"
              rows={5}
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
                placeholder="Anything you'd like me to know? 😊"
            />
          </div>
        )}
        {(
          selectedProposals.length > 0 ||
          customDates.length > 0
        ) && (
          <div className="actions">
            <button
              className="primary-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        )}
      </div> {/* card end  */}
    </div>
  );
}

export default App;