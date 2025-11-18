# events/algorithms/priority_queue.py

class PriorityQueueItem:
    def __init__(self, priority, value):
        self.priority = priority
        self.value = value

    def __lt__(self, other):
        # For a min-heap, lower priority = comes out first
        return self.priority < other.priority


class BinaryHeapPriorityQueue:
    """
    Group 1 advanced data structure: Priority Queue implemented by hand
    using a binary heap.
    """

    def __init__(self):
        self._data = []

    def _parent(self, index):
        return (index - 1) // 2

    def _left(self, index):
        return 2 * index + 1

    def _right(self, index):
        return 2 * index + 2

    def _swap(self, i, j):
        self._data[i], self._data[j] = self._data[j], self._data[i]

    def _heapify_up(self, index):
        while index > 0:
            parent = self._parent(index)
            if self._data[index] < self._data[parent]:
                self._swap(index, parent)
                index = parent
            else:
                break

    def _heapify_down(self, index):
        size = len(self._data)
        while True:
            left = self._left(index)
            right = self._right(index)
            smallest = index

            if left < size and self._data[left] < self._data[smallest]:
                smallest = left
            if right < size and self._data[right] < self._data[smallest]:
                smallest = right

            if smallest != index:
                self._swap(index, smallest)
                index = smallest
            else:
                break

    def push(self, priority, value):
        item = PriorityQueueItem(priority, value)
        self._data.append(item)
        self._heapify_up(len(self._data) - 1)

    def pop(self):
        if not self._data:
            return None
        self._swap(0, len(self._data) - 1)
        item = self._data.pop()
        if self._data:
            self._heapify_down(0)
        return item.value

    def __len__(self):
        return len(self._data)
