# events/algorithms/bloom_filter.py
import math
import hashlib


class BloomFilter:
    """
    Group 2 advanced hashing structure: Bloom Filter.

    We'll use this for quickly checking whether there are events for a
    (culture, location) combination.
    """

    def __init__(self, expected_items=1000, false_positive_rate=0.01):
        # m = number of bits
        m = - (expected_items * math.log(false_positive_rate)) / (math.log(2) ** 2)
        self.size = int(m)
        self.bit_array = [0] * self.size

        # k = number of hash functions
        k = (self.size / expected_items) * math.log(2)
        self.hash_count = max(1, int(k))

    def _hashes(self, item: str):
        for i in range(self.hash_count):
            digest = hashlib.sha256((item + str(i)).encode("utf-8")).hexdigest()
            yield int(digest, 16) % self.size

    def add(self, item: str):
        for idx in self._hashes(item):
            self.bit_array[idx] = 1

    def __contains__(self, item: str):
        return all(self.bit_array[idx] == 1 for idx in self._hashes(item))
