import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Chat } from "./Chat"; // adjust the path if needed
import { vi } from "vitest";
import { chatApi } from "../services/api";

vi.mock("../services/api", () => ({
  chatApi: {
    sendMessage: vi.fn(),
  },
}));

describe("Chat component", () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and send button", () => {
    render(<Chat />);
    expect(
      screen.getByPlaceholderText(/ask about your order/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("does not send empty input", () => {
    render(<Chat />);
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(chatApi.sendMessage).not.toHaveBeenCalled();
  });

  it("sends user message and receives assistant reply", async () => {
    (chatApi.sendMessage as any).mockResolvedValue(
      "🏕️ Here’s your trail suggestion!"
    );
    render(<Chat />);
    const input = screen.getByPlaceholderText(/ask about your order/i);

    fireEvent.change(input, { target: { value: "Suggest a trail" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText("Suggest a trail")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/trail suggestion/i)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    (chatApi.sendMessage as any).mockRejectedValue(new Error("error"));
    render(<Chat />);
    const input = screen.getByPlaceholderText(/ask about your order/i);
    fireEvent.change(input, { target: { value: "Fail me" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/❌ Something went wrong/i)).toBeInTheDocument();
    });
  });

  it("sends on Enter key press", async () => {
    (chatApi.sendMessage as any).mockResolvedValue("🚶 Trail coming up");
    render(<Chat />);
    const input = screen.getByPlaceholderText(/ask about your order/i);

    fireEvent.change(input, { target: { value: "Hit Enter" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/Trail coming up/i)).toBeInTheDocument();
    });
  });

  it("shows loading spinner during message send", async () => {
    let resolveMessage: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolveMessage = resolve;
    });

    (chatApi.sendMessage as any).mockReturnValue(promise);

    render(<Chat />);
    const input = screen.getByPlaceholderText(/ask about your order/i);
    fireEvent.change(input, { target: { value: "Loading test" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByText(/Thinking/)).toBeInTheDocument();

    resolveMessage!("Done");
    await waitFor(() => {
      expect(screen.queryByText(/Thinking/)).not.toBeInTheDocument();
    });
  });
});
