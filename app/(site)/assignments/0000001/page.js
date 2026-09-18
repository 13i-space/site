import Link from "next/link";
import BookReader from "../../../../components/BookReader";
import { pages, assignmentMeta } from "../../../../lib/assignment1";

export default function AssignmentOnePage() {
  return (
    <div>
      <Link href="/assignments" className="mono" style={{ fontSize: 12, color: "#6E76B8" }}>
        &larr; back to Assignments
      </Link>

      <div style={{ marginTop: 20 }}>
        <BookReader
          meta={assignmentMeta}
          pages={pages}
          coverImage="/covers/assignment-0000001.jpg"
          downloadHref="/downloads/assignment-0000001.pdf"
          downloadLabel="Download the PDF"
        />
      </div>
    </div>
  );
}
