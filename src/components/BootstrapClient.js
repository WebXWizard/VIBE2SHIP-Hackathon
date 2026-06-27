"use client";

import { useEffect } from "react";

function BootstrapClient() {
  useEffect(() => {
    // Dynamically import only on the client
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}

export default BootstrapClient;