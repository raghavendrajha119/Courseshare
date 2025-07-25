export default function CourseInfo({ instructor, level, duration, language, price }) {
    return (
      <div className="flex flex-col text-sm text-muted-foreground gap-1">
        <p><strong>Instructor:</strong> {instructor}</p>
        <p><strong>Level:</strong> {level}</p>
        <p><strong>Duration:</strong> {duration.substr(0,2)+' Hrs '+ duration.substr(3,2) + ' Secs'} </p>
        <p><strong>Language:</strong> {language} </p>
        <p><strong>Price:</strong> ₹{price}</p>
      </div>
    );
  }
  