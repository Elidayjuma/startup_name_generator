export default function handler(req, res) {
  if (req.method === "POST") {
    // Process POST request
    const data = req.body; // Your request's body
    // ...do something with the data...
    res.status(200).json({ message: "Data received", data });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
