import PostCard from "./PostCard";
import { PiBeerSteinBold } from "react-icons/pi";

function PostContainer(props) {
  const { allPosts } = props;
  return (
    <div className="flex flex-col gap-4 flex-grow xl:max-w-[25%] break-all">
      <div className="w-full bg-base-100 rounded-lg p-4">
        <h3 className="text-xl font-semibold">Newest Posts</h3>
      </div>
      {/* Container for each post */}
      {allPosts.length > 0 ? (
        allPosts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            userId={post.user.id}
            profilePicture={post.user.profilePicture}
            firstName={post.user.firstName}
            lastName={post.user.lastName}
            date={post.createdAt}
            content={post.content}
            ticket={post.ticket}
            groupedReactions={post.groupedReactions}
          />
        ))
      ) : (
        <div className="flex items-start gap-2 px-2">
          <div className="bg-accent p-1 rounded-full">
            <PiBeerSteinBold className="w-5 h-5" />
          </div>
          <span className="font-semibold text-sm">
            Create a new post to share with your team now!
          </span>
        </div>
      )}
    </div>
  );
}

export default PostContainer;
