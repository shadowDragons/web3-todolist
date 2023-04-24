// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Todo {
    enum Status { undone, done, del }

    uint private incrID = 0;

    struct TodoItem {
        uint256 id;
        Status status;
        bytes32 content;
        address owner;
    }

    mapping(uint256 => TodoItem) private todoList;
    mapping(address => uint256[]) private todoIDList;


    event Add(address sender, uint256 id);
    event Checked(address sender, uint256 id);
    event Del(address sender, uint256 id);

    function add(bytes32 _content) public {
        incrID = incrID + 1;
        todoList[incrID] = TodoItem(incrID, Status.undone, _content, msg.sender);
        todoIDList[msg.sender].push(incrID);
        
        emit Add(msg.sender, incrID);
    }

    function del(uint256 _id) public {
        require(todoList[_id].owner == msg.sender, "Data does not exist");
        require(todoList[_id].owner == msg.sender || todoList[_id].status == Status.done && todoList[_id].status == Status.undone, "Data does not exist");
        todoList[_id].status = Status.del;

        emit Del(msg.sender, _id);
    }

    function checked(uint256 _id) public {
        require(todoList[_id].owner == msg.sender, "Data does not exist");
        require(todoList[_id].status == Status.undone, "Data does not exist");
        todoList[_id].status = Status.done;

        emit Checked(msg.sender, _id);
    }

    function list(Status _status) public view returns(uint256[] memory ids , bytes32[] memory contents, Status[] memory status) {
        uint256 count = todoIDList[msg.sender].length;
        ids = new uint[](count);
        contents = new bytes32[](count);
        status = new Status[](count);

        uint256 realCount = 0;
        uint256 j = 0;
        for (uint256 i = 0; i < count; i++) {
            uint256 id = todoIDList[msg.sender][i];
            if (todoList[id].status == _status) {
                ids[j] = id;
                contents[j] = todoList[id].content;
                status[j] = todoList[id].status;
                realCount ++;
                j ++;
            }
        }

        assembly {mstore(ids, realCount)}
        assembly {mstore(contents, realCount)}
        assembly {mstore(status, realCount)}
        return (ids, contents, status);
    }
}