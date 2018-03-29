Spent first 30 minutes reading through code, finding and reading https://tools.ietf.org/html/rfc6901 on JSON pointers.

Brainstormed in the shower for 15 minutes.

Things to avoid:
- recursion (dangerous and hard to debug)
- loss of information (makes error messages harder and debugging)
- unboundedness (always nice to have a progress bar/metric)

Stated strategy:
- JSON.parse(input)
- walk through object and find all $refs
- resolve all refs (or given subset) iteratively
- collect unresolvable or invalid refs into error messages
- build output object

Let's see how close we stick to that plan...

Got these steps done before bed:
- walk through object and find all $refs
- resolve all refs (or given subset) iteratively
- collect invalid refs into error messages

Got these steps done at coffee shop this morning:
- JSON.parse(input)
- build output object
- collect unresolvable into error messages

An hour into my coffee shop workout, I realize my OH S*** mistake:
    I have to resolve all pointers lazily to take advantage of
    the jsonPointer option that only requires a subset of the graph.
This doesn't matter now for performance, but when we add in HTTP requests 
it will.

I take a break from "the hard stuff". Let's uncomment the fixtures,
add URL fetching, and see how many tests pass without worrying about
the 'jsonPointer' option.

Answer: not many. (the fixtures rely on file authorities etc)

So. To handle pointers to objects that contain pointers, we need to
crawl the result object, not the source object. (Unless we can guarantee
a bottom up construction of th4 result object, which I don't think is
possible.) And to get lazy resolving we need to focus on the result object
anyway. So. Time for another rewrite.

And... I should have installed my custom git aliases on my new machine.
Forgot that git stash doesn't save unstaged changes by default. :'(
