import cv2
import pytesseract
import re

# OPTIONAL: Set this if you're on Windows and Tesseract is not in PATH
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_total_price(text):
    # Find all prices like 12.99, 5.00, etc.
    prices = re.findall(r'\d+\.\d{2}', text)
    if not prices:
        return 0.0
    float_prices = [float(p) for p in prices]
    return max(float_prices)

def scan_receipt():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Unable to access the camera.")
        return

    print("📸 Press 's' to scan the receipt or 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to read from camera.")
            break

        cv2.imshow("Receipt Scanner", frame)
        key = cv2.waitKey(1)

        if key == ord('s'):
            # Save the captured frame
            cv2.imwrite("receipt.jpg", frame)
            print("✅ Receipt image captured!")
            break
        elif key == ord('q'):
            print("👋 Quitting...")
            cap.release()
            cv2.destroyAllWindows()
            return

    cap.release()
    cv2.destroyAllWindows()

    # OCR process
    img = cv2.imread("receipt.jpg")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)

    print("\n📝 Extracted Text:\n", text)

    total = extract_total_price(text)
    print(f"\n💰 Estimated Total Price: ${total:.2f}")

# Main loop for repeated scans
while True:
    scan_receipt()
    again = input("\n🔁 Do you want to scan another receipt? (y/n): ").strip().lower()
    if again != 'y':
        print("👋 Bye!")
        break
