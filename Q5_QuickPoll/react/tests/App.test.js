import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

const text = (container, selector) => container.querySelector(selector).textContent;

const vote = (container, option, times = 1) => {
  for (let i = 0; i < times; i++) {
    fireEvent.click(container.querySelector(`#vote${option}`));
  }
};

const click = (container, selector) => {
  fireEvent.click(container.querySelector(selector));
};

describe("Quick Poll App", () => {
  test("verify_vote_increases_only_the_clicked_option_and_total", () => {
    const { container } = render(<App />);
    vote(container, "React");
    expect(text(container, "#countReact")).toBe("1");
    expect(text(container, "#countAngular")).toBe("0");
    expect(text(container, "#countVue")).toBe("0");
    expect(text(container, "#totalVotes")).toBe("1");
  });

  test("verify_total_votes_is_the_sum_of_all_options", () => {
    const { container } = render(<App />);
    vote(container, "React", 2);
    vote(container, "Angular", 3);
    vote(container, "Vue", 1);
    expect(text(container, "#countReact")).toBe("2");
    expect(text(container, "#countAngular")).toBe("3");
    expect(text(container, "#countVue")).toBe("1");
    expect(text(container, "#totalVotes")).toBe("6");
  });

  test("verify_percentages_are_rounded_to_whole_numbers", () => {
    const { container } = render(<App />);
    vote(container, "React", 1);
    vote(container, "Angular", 2);
    expect(text(container, "#percentReact")).toBe("33");
    expect(text(container, "#percentAngular")).toBe("67");
    expect(text(container, "#percentVue")).toBe("0");
  });

  test("verify_percentages_are_zero_when_there_are_no_votes", () => {
    const { container } = render(<App />);
    expect(text(container, "#percentReact")).toBe("0");
    expect(text(container, "#percentAngular")).toBe("0");
    expect(text(container, "#percentVue")).toBe("0");
    expect(container.textContent).not.toContain("NaN");
  });

  test("verify_leader_shows_the_option_with_most_votes", () => {
    const { container } = render(<App />);
    vote(container, "Vue", 1);
    expect(text(container, "#leader")).toBe("Leading: Vue");
    vote(container, "Angular", 2);
    expect(text(container, "#leader")).toBe("Leading: Angular");
  });

  test("verify_leader_message_for_no_votes_and_for_a_tie", () => {
    const { container } = render(<App />);
    expect(text(container, "#leader")).toBe("No votes yet");

    vote(container, "React", 1);
    vote(container, "Angular", 1);
    expect(text(container, "#leader")).toBe("It's a tie");

    vote(container, "Vue", 1);
    expect(text(container, "#leader")).toBe("It's a tie");

    vote(container, "Vue", 1);
    expect(text(container, "#leader")).toBe("Leading: Vue");
  });

  test("verify_undo_removes_the_most_recent_vote", () => {
    const { container } = render(<App />);
    vote(container, "React", 2);
    vote(container, "Vue", 1);
    click(container, "#undoBtn");
    expect(text(container, "#countVue")).toBe("0");
    expect(text(container, "#countReact")).toBe("2");
    expect(text(container, "#totalVotes")).toBe("2");
  });

  test("verify_undo_works_only_once_per_vote", () => {
    const { container } = render(<App />);
    vote(container, "React", 3);
    click(container, "#undoBtn");
    click(container, "#undoBtn");
    click(container, "#undoBtn");
    expect(text(container, "#countReact")).toBe("2");
    expect(text(container, "#totalVotes")).toBe("2");
  });

  test("verify_undo_without_any_vote_does_nothing", () => {
    const { container } = render(<App />);
    click(container, "#undoBtn");
    expect(text(container, "#totalVotes")).toBe("0");
    expect(text(container, "#countReact")).toBe("0");
    expect(text(container, "#leader")).toBe("No votes yet");
  });

  test("verify_undo_targets_the_latest_vote_and_reset_clears_everything", () => {
    const { container } = render(<App />);
    vote(container, "React", 1);
    vote(container, "Angular", 1);
    click(container, "#undoBtn"); // removes the Angular vote
    vote(container, "Vue", 1);
    click(container, "#undoBtn"); // removes the Vue vote
    expect(text(container, "#countReact")).toBe("1");
    expect(text(container, "#countAngular")).toBe("0");
    expect(text(container, "#countVue")).toBe("0");

    vote(container, "Vue", 2);
    click(container, "#resetBtn");
    expect(text(container, "#countReact")).toBe("0");
    expect(text(container, "#countVue")).toBe("0");
    expect(text(container, "#totalVotes")).toBe("0");
    expect(text(container, "#leader")).toBe("No votes yet");

    click(container, "#undoBtn"); // nothing left to undo after a reset
    expect(text(container, "#totalVotes")).toBe("0");
  });
});
