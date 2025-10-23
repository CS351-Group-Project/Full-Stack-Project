# utils/trie.py

class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end_of_word = False
        self.data = []  # store event IDs or names associated with this prefix


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word, data=None):
        """Insert a word (event name) with optional associated data"""
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True
        if data:
            node.data.append(data)

    def search(self, word):
        """Return True if word exists"""
        node = self.root
        for char in word.lower():
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    def autocomplete(self, prefix):
        """Return all words starting with the given prefix"""
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []
            node = node.children[char]

        results = []
        self._dfs(node, prefix.lower(), results)
        return results

    def _dfs(self, node, prefix, results):
        if node.is_end_of_word:
            results.append(prefix)
        for char, next_node in node.children.items():
            self._dfs(next_node, prefix + char, results)
