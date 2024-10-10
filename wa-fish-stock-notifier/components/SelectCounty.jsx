export default function SelectCounty() {

    return (
        <div className="flex mb-4">
        <label htmlFor="county" className="text-green-900 mr-2">
          Filter by County:
        </label>
        <select
          name="county"
          id="county"
          className="p-2 border border-green-800"
          value={county}
          
        >
          <option value="">All</option>
          <option value="Adams">Adams</option>
          <option value="Asotin">Asotin</option>
          <option value="Benton">Benton</option>
          <option value="Chelan">Chelan</option>
          <option value="Clallam">Clallam</option>
          <option value="Clark">Clark</option>
          <option value="Columbia">Columbia</option>
          <option value="Cowlitz">Cowlitz</option>
          <option value="Douglas">Douglas</option>
          <option value="Ferry">Ferry</option>
          <option value="Franklin">Franklin</option>
          <option value="Garfield">Garfield</option>
          <option value="Grant">Grant</option>
          <option value="Grays Harbor">Grays Harbor</option>
          <option value="Island">Island</option>
          <option value="Jefferson">Jefferson</option>
          <option value="King">King</option>
          <option value="Kitsap">Kitsap</option>
          <option value="Kittitas">Kittitas</option>
          <option value="Klickitat">Klickitat</option>
          <option value="Lewis">Lewis</option>
          <option value="Lincoln">Lincoln</option>
          <option value="Mason">Mason</option>
          <option value="Okanogan">Okanogan</option>
          <option value="Pacific">Pacific</option>
          <option value="Pend Oreille">Pend Oreille</option>
          <option value="Pierce">Pierce</option>
          <option value="San Juan">San Juan</option>
          <option value="Skagit">Skagit</option>
          <option value="Skamania">Skamania</option>
          <option value="Snohomish">Snohomish</option>
          <option value="Spokane">Spokane</option>
          <option value="Stevens">Stevens</option>
          <option value="Thurston">Thurston</option>
          <option value="Wahkiakum">Wahkiakum</option>
          <option value="Walla Walla">Walla Walla</option>
          <option value="Whatcom">Whatcom</option>
          <option value="Whitman">Whitman</option>
          <option value="Yakima">Yakima</option>
        </select>
      </div>
    )}